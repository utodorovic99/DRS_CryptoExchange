"""empty message

Revision ID: f65a49cff1d7
Revises: 
Create Date: 2022-01-25 15:54:14.210630

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f65a49cff1d7'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('cryptocurrency',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cryptoName', sa.String(length=10), nullable=True),
    sa.Column('exchangeRate', sa.Float(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('cryptoName')
    )
    op.create_table('iuser',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('firstName', sa.String(length=30), nullable=True),
    sa.Column('lastName', sa.String(length=30), nullable=True),
    sa.Column('address', sa.String(length=50), nullable=True),
    sa.Column('email', sa.String(length=50), nullable=True),
    sa.Column('city', sa.String(length=50), nullable=True),
    sa.Column('country', sa.String(length=60), nullable=True),
    sa.Column('phoneNumber', sa.BigInteger(), nullable=True),
    sa.Column('password', sa.String(length=65), nullable=True),
    sa.Column('verified', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('cryptoaccount',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('accountBalance', sa.Float(), nullable=True),
    sa.Column('userId', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['userId'], ['iuser.id'], ),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('transaction',
    sa.Column('hashID', sa.String(length=256), nullable=False),
    sa.Column('amount', sa.Float(), nullable=True),
    sa.Column('state', sa.String(length=100), nullable=True),
    sa.Column('cryptoCurrencyId', sa.String(length=10), nullable=True),
    sa.Column('userfromid', sa.Integer(), nullable=True),
    sa.Column('usertoid', sa.Integer(), nullable=True),
    sa.ForeignKeyConstraint(['cryptoCurrencyId'], ['cryptocurrency.cryptoName'], ),
    sa.ForeignKeyConstraint(['userfromid'], ['iuser.id'], ),
    sa.ForeignKeyConstraint(['usertoid'], ['iuser.id'], ),
    sa.PrimaryKeyConstraint('hashID')
    )
    op.create_table('cryptocurrencyaccount',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('cryptoBalance', sa.Float(), nullable=True),
    sa.Column('cryptoAccountId', sa.Integer(), nullable=True),
    sa.Column('cryptoCurrencyId', sa.String(length=10), nullable=True),
    sa.ForeignKeyConstraint(['cryptoAccountId'], ['cryptoaccount.id'], ),
    sa.ForeignKeyConstraint(['cryptoCurrencyId'], ['cryptocurrency.cryptoName'], ),
    sa.PrimaryKeyConstraint('id')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cryptocurrencyaccount')
    op.drop_table('transaction')
    op.drop_table('cryptoaccount')
    op.drop_table('iuser')
    op.drop_table('cryptocurrency')
    # ### end Alembic commands ###