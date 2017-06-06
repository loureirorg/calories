class Meal < ApplicationRecord
  belongs_to :user

  validates :calories, presence: true, numericality: { only_integer: true }
  validates :title, presence: true
  validates :eat_date, presence: true
  validates :eat_time, presence: true

  validate :time_cannot_be_invalid,
           :date_cannot_be_in_the_future

  private

  def date_cannot_be_in_the_future
    if eat_date.present? && eat_date > Time.zone.today
      errors.add(:eat_date, "can't be in the future")
    end
  end

  def time_cannot_be_invalid
    if eat_time.present?
      time = Time.strptime(eat_time, '%k:%M') rescue nil
      errors.add(:eat_time, "can't be invalid") if time.nil?
    end
  end

end

class MealSerializer < ActiveModel::Serializer
  attributes :id,
             :user_id, :title, :calories, :eat_date, :eat_time

  # belongs_to :user
end
