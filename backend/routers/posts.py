from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional
from datetime import datetime
import re

from database import get_db
from database.models import User, Post, Comment, PostEditor, Category, Tag, PostTag
from database.schemas import PostCreate, PostUpdate, PostResponse, CommentCreate, CommentResponse, UserInfo, CategoryResponse, TagResponse
from auth import get_current_user

router = APIRouter(prefix="/api/posts", tags=["posts"])


def require_editor_or_admin(current_user: User = Depends(get_current_user)):
    """편집자 또는 관리자 권한 확인"""
    if not (current_user.is_editor or current_user.is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Editor or admin access required"
        )
    return current_user


def slugify(text: str) -> str:
    """텍스트를 slug로 변환"""
    # 소문자로 변환하고 공백을 하이픈으로 변경
    slug = text.lower()
    slug = re.sub(r'[^\w\s-]', '', slug)
    slug = re.sub(r'[-\s]+', '-', slug)
    return slug.strip('-')


@router.get("", response_model=List[PostResponse])
async def get_posts(
    skip: int = 0,
    limit: int = 100,
    search: Optional[str] = None,
    published_only: Optional[bool] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """포스트 목록 조회"""
    query = db.query(Post)
    
    # 편집자나 관리자가 아니면 published만 보여줌
    if not (current_user.is_editor or current_user.is_admin):
        query = query.filter(Post.is_published == True)
    elif published_only:
        query = query.filter(Post.is_published == published_only)
    
    # 검색 기능
    if search:
        query = query.filter(
            or_(
                Post.title.ilike(f"%{search}%"),
                Post.content.ilike(f"%{search}%")
            )
        )
    
    posts = query.order_by(Post.created_at.desc()).offset(skip).limit(limit).all()
    
    # 관계 데이터 로드
    for post in posts:
        post.author = db.query(User).filter(User.id == post.author_id).first()
        if post.category_id:
            post.category = db.query(Category).filter(Category.id == post.category_id).first()
        post_editors = db.query(PostEditor).filter(PostEditor.post_id == post.id).all()
        post.editors = [db.query(User).filter(User.id == pe.user_id).first() for pe in post_editors]
        # 태그 로드
        post_tags = db.query(PostTag).filter(PostTag.post_id == post.id).all()
        post.tags = [db.query(Tag).filter(Tag.id == pt.tag_id).first() for pt in post_tags]
    
    return posts


@router.get("/{post_id}", response_model=PostResponse)
async def get_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """포스트 상세 조회"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # published가 아니고 편집자/관리자가 아니면 접근 불가
    if not post.is_published and not (current_user.is_editor or current_user.is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Post is not published"
        )
    
    post.author = db.query(User).filter(User.id == post.author_id).first()
    if post.category_id:
        post.category = db.query(Category).filter(Category.id == post.category_id).first()
    post_editors = db.query(PostEditor).filter(PostEditor.post_id == post.id).all()
    post.editors = [db.query(User).filter(User.id == pe.user_id).first() for pe in post_editors]
    # 태그 로드
    post_tags = db.query(PostTag).filter(PostTag.post_id == post.id).all()
    post.tags = [db.query(Tag).filter(Tag.id == pt.tag_id).first() for pt in post_tags]
    
    return post


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED)
async def create_post(
    post_data: PostCreate,
    current_user: User = Depends(require_editor_or_admin),
    db: Session = Depends(get_db)
):
    """포스트 생성 (편집자/관리자만)"""
    # slug 생성
    slug = slugify(post_data.slug) if post_data.slug else slugify(post_data.title)
    
    # slug 중복 확인
    existing_post = db.query(Post).filter(Post.slug == slug).first()
    if existing_post:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Slug already exists"
        )
    
    # 새 포스트 생성
    new_post = Post(
        title=post_data.title,
        content=post_data.content,
        slug=slug,
        author_id=current_user.id,
        category_id=post_data.category_id,
        is_published=False
    )
    
    db.add(new_post)
    db.commit()
    db.refresh(new_post)
    
    # 태그 연결
    tag_ids_to_link = []
    
    # 기존 태그 ID 연결
    if post_data.tag_ids:
        for tag_id in post_data.tag_ids:
            tag = db.query(Tag).filter(Tag.id == tag_id).first()
            if tag:
                tag_ids_to_link.append(tag_id)
    
    # 새 태그 이름으로 태그 생성 및 연결
    if post_data.tag_names:
        for tag_name in post_data.tag_names:
            tag_name = tag_name.strip()
            if tag_name:
                # 기존 태그 확인
                tag_slug = slugify(tag_name)
                existing_tag = db.query(Tag).filter(Tag.slug == tag_slug).first()
                if existing_tag:
                    if existing_tag.id not in tag_ids_to_link:
                        tag_ids_to_link.append(existing_tag.id)
                else:
                    # 새 태그 생성
                    new_tag = Tag(name=tag_name, slug=tag_slug)
                    db.add(new_tag)
                    db.flush()
                    tag_ids_to_link.append(new_tag.id)
    
    # 태그 연결
    for tag_id in tag_ids_to_link:
        post_tag = PostTag(post_id=new_post.id, tag_id=tag_id)
        db.add(post_tag)
    
    db.commit()
    
    new_post.author = current_user
    new_post.editors = []
    if new_post.category_id:
        new_post.category = db.query(Category).filter(Category.id == new_post.category_id).first()
    post_tags = db.query(PostTag).filter(PostTag.post_id == new_post.id).all()
    new_post.tags = [db.query(Tag).filter(Tag.id == pt.tag_id).first() for pt in post_tags]
    
    return new_post


@router.put("/{post_id}", response_model=PostResponse)
async def update_post(
    post_id: int,
    post_data: PostUpdate,
    current_user: User = Depends(require_editor_or_admin),
    db: Session = Depends(get_db)
):
    """포스트 수정 (편집자/관리자만)"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # 수정 권한 확인 (작성자이거나 관리자)
    if post.author_id != current_user.id and not current_user.is_admin:
        # 편집자는 다른 사람의 글도 수정 가능하지만, 편집자 목록에 추가
        if not current_user.is_editor:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to edit this post"
            )
    
    # 포스트 정보 업데이트
    if post_data.title is not None:
        post.title = post_data.title
    if post_data.content is not None:
        post.content = post_data.content
    if post_data.slug is not None:
        new_slug = slugify(post_data.slug)
        # slug 중복 확인 (자신의 slug는 제외)
        existing_post = db.query(Post).filter(Post.slug == new_slug, Post.id != post_id).first()
        if existing_post:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Slug already exists"
            )
        post.slug = new_slug
    if post_data.category_id is not None:
        # 카테고리 존재 확인
        if post_data.category_id:
            category = db.query(Category).filter(Category.id == post_data.category_id).first()
            if not category:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Category not found"
                )
        post.category_id = post_data.category_id
    
    # 편집자가 다른 사람의 글을 수정한 경우 편집자 목록에 추가
    if post.author_id != current_user.id:
        existing_editor = db.query(PostEditor).filter(
            PostEditor.post_id == post_id,
            PostEditor.user_id == current_user.id
        ).first()
        if not existing_editor:
            editor = PostEditor(post_id=post_id, user_id=current_user.id)
            db.add(editor)
    
    # 태그 업데이트
    if post_data.tag_ids is not None or post_data.tag_names is not None:
        # 기존 태그 삭제
        db.query(PostTag).filter(PostTag.post_id == post_id).delete()
        
        tag_ids_to_link = []
        
        # 기존 태그 ID 연결
        if post_data.tag_ids:
            for tag_id in post_data.tag_ids:
                tag = db.query(Tag).filter(Tag.id == tag_id).first()
                if tag:
                    tag_ids_to_link.append(tag_id)
        
        # 새 태그 이름으로 태그 생성 및 연결
        if post_data.tag_names:
            for tag_name in post_data.tag_names:
                tag_name = tag_name.strip()
                if tag_name:
                    # 기존 태그 확인
                    tag_slug = slugify(tag_name)
                    existing_tag = db.query(Tag).filter(Tag.slug == tag_slug).first()
                    if existing_tag:
                        if existing_tag.id not in tag_ids_to_link:
                            tag_ids_to_link.append(existing_tag.id)
                    else:
                        # 새 태그 생성
                        new_tag = Tag(name=tag_name, slug=tag_slug)
                        db.add(new_tag)
                        db.flush()
                        tag_ids_to_link.append(new_tag.id)
        
        # 태그 연결
        for tag_id in tag_ids_to_link:
            post_tag = PostTag(post_id=post_id, tag_id=tag_id)
            db.add(post_tag)
    
    db.commit()
    db.refresh(post)
    
    post.author = db.query(User).filter(User.id == post.author_id).first()
    if post.category_id:
        post.category = db.query(Category).filter(Category.id == post.category_id).first()
    post_editors = db.query(PostEditor).filter(PostEditor.post_id == post.id).all()
    post.editors = [db.query(User).filter(User.id == pe.user_id).first() for pe in post_editors]
    # 태그 로드
    post_tags = db.query(PostTag).filter(PostTag.post_id == post.id).all()
    post.tags = [db.query(Tag).filter(Tag.id == pt.tag_id).first() for pt in post_tags]
    
    return post


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """포스트 삭제 (작성자 또는 관리자만)"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # 삭제 권한 확인
    if post.author_id != current_user.id and not current_user.is_admin:
        # 편집자는 자신의 글만 삭제 가능
        if current_user.is_editor:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Editors can only delete their own posts"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this post"
            )
    
    db.delete(post)
    db.commit()
    
    return None


@router.post("/{post_id}/publish", response_model=PostResponse)
async def toggle_publish_post(
    post_id: int,
    current_user: User = Depends(require_editor_or_admin),
    db: Session = Depends(get_db)
):
    """포스트 publish 토글 (편집자/관리자만)"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    post.is_published = not post.is_published
    if post.is_published and not post.published_at:
        post.published_at = datetime.utcnow()
    elif not post.is_published:
        post.published_at = None
    
    db.commit()
    db.refresh(post)
    
    post.author = db.query(User).filter(User.id == post.author_id).first()
    if post.category_id:
        post.category = db.query(Category).filter(Category.id == post.category_id).first()
    post_editors = db.query(PostEditor).filter(PostEditor.post_id == post.id).all()
    post.editors = [db.query(User).filter(User.id == pe.user_id).first() for pe in post_editors]
    # 태그 로드
    post_tags = db.query(PostTag).filter(PostTag.post_id == post.id).all()
    post.tags = [db.query(Tag).filter(Tag.id == pt.tag_id).first() for pt in post_tags]
    
    return post


@router.get("/{post_id}/comments", response_model=List[CommentResponse])
async def get_comments(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """댓글 목록 조회"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # published가 아니고 편집자/관리자가 아니면 접근 불가
    if not post.is_published and not (current_user.is_editor or current_user.is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Post is not published"
        )
    
    comments = db.query(Comment).filter(Comment.post_id == post_id).order_by(Comment.created_at.asc()).all()
    
    for comment in comments:
        comment.user = db.query(User).filter(User.id == comment.user_id).first()
    
    return comments


@router.post("/{post_id}/comments", response_model=CommentResponse, status_code=status.HTTP_201_CREATED)
async def create_comment(
    post_id: int,
    comment_data: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """댓글 작성"""
    post = db.query(Post).filter(Post.id == post_id).first()
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found"
        )
    
    # published가 아니고 편집자/관리자가 아니면 댓글 작성 불가
    if not post.is_published and not (current_user.is_editor or current_user.is_admin):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Cannot comment on unpublished post"
        )
    
    # 새 댓글 생성
    new_comment = Comment(
        post_id=post_id,
        user_id=current_user.id,
        content=comment_data.content
    )
    
    db.add(new_comment)
    db.commit()
    db.refresh(new_comment)
    
    new_comment.user = current_user
    
    return new_comment


@router.delete("/comments/{comment_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_comment(
    comment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """댓글 삭제 (작성자 또는 관리자만)"""
    comment = db.query(Comment).filter(Comment.id == comment_id).first()
    if not comment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comment not found"
        )
    
    # 삭제 권한 확인
    if comment.user_id != current_user.id and not current_user.is_admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this comment"
        )
    
    db.delete(comment)
    db.commit()
    
    return None


# Categories 라우터
@router.get("/categories", response_model=List[CategoryResponse])
async def get_categories(
    db: Session = Depends(get_db)
):
    """카테고리 목록 조회"""
    categories = db.query(Category).order_by(Category.name).all()
    return categories


# Tags 라우터
@router.get("/tags", response_model=List[TagResponse])
async def get_tags(
    db: Session = Depends(get_db)
):
    """태그 목록 조회"""
    tags = db.query(Tag).order_by(Tag.name).all()
    return tags

