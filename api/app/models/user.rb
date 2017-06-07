class User < ApplicationRecord
  has_many :meals

  # Include default devise modules. Others available are:
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, # :confirmable,
         :recoverable, :rememberable, :trackable, :validatable

  validates :name, presence: true
  validates :daily_calories_max, presence: true, numericality: { only_integer: true }

  # searchable
  include PgSearch
  pg_search_scope :search_for, against: [:name, :email], using: { tsearch: { prefix: true, any_word: true } }
end

class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :name, :daily_calories_max, :email, :role

  # has_many :meals
end
