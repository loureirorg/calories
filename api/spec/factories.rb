FactoryGirl.define do
  factory :user do
    name { Faker::Name.name }
    email { Faker::Internet.email }
    daily_calories_max { Faker::Number.between(9, 22) * 100}
    password 'password'
    role 'USER'

    factory :admin do
      role 'ADMIN'
    end

    factory :manager do
      role 'MANAGER'
    end

    trait :with_meals do
      after :create do |user|
        FactoryGirl.create_list(:meal, 30, user: user)
      end
    end
  end

  factory :meal do
    title { Faker::Food.ingredient }
    calories { Faker::Number.between(10, 220) * 5 }
    eat_date { Faker::Date.between(7.days.ago, 1.day.ago).to_s }
    eat_time { Faker::Time.between(DateTime.now - 1, DateTime.now).to_s[11,5] }

    user
  end
end
