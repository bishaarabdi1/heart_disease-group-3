"""create users and assessments tables

Revision ID: 001_create_tables
Revises: 
Create Date: 2026-08-29 20:58:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = '001_create_tables'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1. Create users table
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('full_name', sa.String(length=80), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('password_hash', sa.String(length=255), nullable=False),
        sa.Column('role', sa.String(length=20), nullable=False, server_default='user'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('true')),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column('updated_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)

    # 2. Create assessments table
    op.create_table(
        'assessments',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('age', sa.Integer(), nullable=False),
        sa.Column('sex', sa.Integer(), nullable=False),
        sa.Column('trestbps', sa.Float(), nullable=False),
        sa.Column('chol', sa.Float(), nullable=False),
        sa.Column('fbs', sa.Integer(), nullable=False),
        sa.Column('thalach', sa.Float(), nullable=False),
        sa.Column('oldpeak', sa.Float(), nullable=False),
        sa.Column('cp', sa.Integer(), nullable=False),
        sa.Column('restecg', sa.Integer(), nullable=False),
        sa.Column('exang', sa.Integer(), nullable=False),
        sa.Column('slope', sa.Integer(), nullable=False),
        sa.Column('ca', sa.Integer(), nullable=False),
        sa.Column('thal', sa.Integer(), nullable=False),
        sa.Column('risk_class', sa.Integer(), nullable=False),
        sa.Column('result', sa.String(length=50), nullable=False),
        sa.Column('lower_risk', sa.Float(), nullable=False),
        sa.Column('higher_risk', sa.Float(), nullable=False),
        sa.Column('model_percentage', sa.Float(), nullable=False),
        sa.Column('model_name', sa.String(length=50), nullable=False, server_default='Logistic Regression'),
        sa.Column('model_version', sa.String(length=20), nullable=False, server_default='1.0'),
        sa.Column('created_at', sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
    )
    op.create_index(op.f('ix_assessments_user_id'), 'assessments', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_assessments_user_id'), table_name='assessments')
    op.drop_table('assessments')
    op.drop_index(op.f('ix_users_email'), table_name='users')
    op.drop_table('users')
