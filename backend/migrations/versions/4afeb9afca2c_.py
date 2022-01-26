"""empty message

Revision ID: 4afeb9afca2c
Revises: 
Create Date: 2022-01-25 18:30:32.336998

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '4afeb9afca2c'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('cryptocurrencyaccount')
    op.drop_table('cryptoaccount')
    op.drop_table('cryptocurrency')
    op.drop_table('iuser')
    op.drop_table('transaction')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('transaction',
    sa.Column('hashID', sa.VARCHAR(length=256), autoincrement=False, nullable=False),
    sa.Column('amount', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('state', sa.VARCHAR(length=100), autoincrement=False, nullable=True),
    sa.Column('cryptoCurrencyId', sa.VARCHAR(length=10), autoincrement=False, nullable=True),
    sa.Column('userfromid', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('usertoid', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['cryptoCurrencyId'], ['cryptocurrency.cryptoName'], name='transaction_cryptoCurrencyId_fkey'),
    sa.ForeignKeyConstraint(['userfromid'], ['iuser.id'], name='transaction_userfromid_fkey'),
    sa.ForeignKeyConstraint(['usertoid'], ['iuser.id'], name='transaction_usertoid_fkey'),
    sa.PrimaryKeyConstraint('hashID', name='transaction_pkey')
    )
    op.create_table('iuser',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('iuser_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('firstName', sa.VARCHAR(length=30), autoincrement=False, nullable=True),
    sa.Column('lastName', sa.VARCHAR(length=30), autoincrement=False, nullable=True),
    sa.Column('address', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('email', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('city', sa.VARCHAR(length=50), autoincrement=False, nullable=True),
    sa.Column('country', sa.VARCHAR(length=60), autoincrement=False, nullable=True),
    sa.Column('phoneNumber', sa.BIGINT(), autoincrement=False, nullable=True),
    sa.Column('password', sa.VARCHAR(length=65), autoincrement=False, nullable=True),
    sa.Column('verified', sa.BOOLEAN(), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='iuser_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('cryptocurrency',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('cryptocurrency_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('cryptoName', sa.VARCHAR(length=10), autoincrement=False, nullable=True),
    sa.Column('exchangeRate', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.PrimaryKeyConstraint('id', name='cryptocurrency_pkey'),
    sa.UniqueConstraint('cryptoName', name='cryptocurrency_cryptoName_key'),
    postgresql_ignore_search_path=False
    )
    op.create_table('cryptoaccount',
    sa.Column('id', sa.INTEGER(), server_default=sa.text("nextval('cryptoaccount_id_seq'::regclass)"), autoincrement=True, nullable=False),
    sa.Column('accountBalance', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('userId', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['userId'], ['iuser.id'], name='cryptoaccount_userId_fkey'),
    sa.PrimaryKeyConstraint('id', name='cryptoaccount_pkey'),
    postgresql_ignore_search_path=False
    )
    op.create_table('cryptocurrencyaccount',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('cryptoBalance', postgresql.DOUBLE_PRECISION(precision=53), autoincrement=False, nullable=True),
    sa.Column('cryptoAccountId', sa.INTEGER(), autoincrement=False, nullable=True),
    sa.Column('cryptoCurrencyId', sa.VARCHAR(length=10), autoincrement=False, nullable=True),
    sa.ForeignKeyConstraint(['cryptoAccountId'], ['cryptoaccount.id'], name='cryptocurrencyaccount_cryptoAccountId_fkey'),
    sa.ForeignKeyConstraint(['cryptoCurrencyId'], ['cryptocurrency.cryptoName'], name='cryptocurrencyaccount_cryptoCurrencyId_fkey'),
    sa.PrimaryKeyConstraint('id', name='cryptocurrencyaccount_pkey')
    )
    # ### end Alembic commands ###