RSpec.describe 'Meals API', type: :request do
  include UserHelpers
  include MealsHelpers

  describe '#update' do
    it 'should return not found if meal does belong to the user' do
      # user 1
      successful_sign_up
      meal = successful_meal_create
      successful_sign_out

      # user 2
      successful_sign_up
      put "/meals/#{meal['id']}",
          params: { meal: { title: 'New Title' } },
          as: :json
      assert_response :not_found
    end

    it 'should return success if user is an ADMIN' do
      # user 1
      user1 = successful_sign_up
      meal = successful_meal_create
      successful_sign_out

      # user 2
      user2 = FactoryGirl.create(:admin)
      successful_sign_in(user2)
      put "/meals/#{meal['id']}",
          params: { meal: { title: 'New Title' } },
          as: :json
      assert_response :success

      # confirm changes
      successful_sign_in(user1)
      get "/meals/#{meal['id']}"
      assert_response :success
      expect(json).to eq(meal.as_json.merge('title' => 'New Title'))
    end

    it 'should return success if meal does belong to the user' do
      successful_sign_up
      meal = successful_meal_create
      put "/meals/#{meal['id']}",
          params: { meal: { title: 'New Title' } },
          as: :json
      assert_response :success
    end
  end

  describe '#create' do
    it 'should return unauthorized if not signed in' do
      meal = FactoryGirl.build(:meal)
      post '/meals', params: { meal: meal }, as: :json
      assert_response :unauthorized
    end

    it 'should return success is user is logged in' do
      successful_sign_up
      successful_meal_create
    end

    it 'should return "unprocessable" if some field is invalid' do
      successful_sign_up
      meal = FactoryGirl.build(:meal).as_json

      params = { meal: meal.merge(calories: 'test') }
      post '/meals', params: params, as: :json
      expect(json['errors'].length).to eq(1)
      expect(json['errors']['calories']).to_not be_nil
      assert_response :unprocessable_entity

      params = { meal: meal.merge(eat_date: '2017-13-01') }
      post '/meals', params: params, as: :json
      expect(json['errors'].length).to eq(1)
      expect(json['errors']['eat_date']).to_not be_nil
      assert_response :unprocessable_entity

      params = { meal: meal.merge(eat_time: '22AM') }
      post '/meals', params: params, as: :json
      expect(json['errors'].length).to eq(1)
      expect(json['errors']['eat_time']).to_not be_nil
      assert_response :unprocessable_entity
    end

    it 'should return "unprocessable" if missing some field' do
      successful_sign_up
      meal = FactoryGirl.build(:meal).as_json

      params = { meal: meal.merge(title: '') }
      post '/meals', params: params, as: :json
      expect(json['errors'].length).to eq(1)
      expect(json['errors']['title']).to_not be_nil
      assert_response :unprocessable_entity

      params = { meal: meal.merge(calories: '') }
      post '/meals', params: params, as: :json
      expect(json['errors'].length).to eq(1)
      expect(json['errors']['calories']).to_not be_nil
      assert_response :unprocessable_entity

      params = { meal: meal.merge(eat_date: '') }
      post '/meals', params: params, as: :json
      expect(json['errors'].length).to eq(1)
      expect(json['errors']['eat_date']).to_not be_nil
      assert_response :unprocessable_entity

      params = { meal: meal.merge(eat_time: '') }
      post '/meals', params: params, as: :json
      expect(json['errors'].length).to eq(1)
      expect(json['errors']['eat_time']).to_not be_nil
      assert_response :unprocessable_entity
    end
  end

  describe '#index' do
    it 'should return unauthorized if not signed in' do
      get '/meals', as: :json
      expect(json['error']).to eq('You need to sign in or sign up before continuing.')
      assert_response :unauthorized
    end

    it 'should return user meals if signed in' do
      # creates 2 users, each one with 30 meals
      user1 = FactoryGirl.create(:user, :with_meals)
      user2 = FactoryGirl.create(:user, :with_meals)

      # authenticates user 1 and get API data
      successful_sign_in(user1)
      get '/meals', as: :json
      assert_response :success

      # compare API vs Model
      user2_meals_count = user2.meals.count # should be unaffected
      json.each do |eat_date, data|
        data['meals'].each do |meal_array|
          # looks on db, compare, delete
          found = user1.meals.find_by(
            user: user1,
            eat_date: eat_date,
            eat_time: meal_array[1],
            calories: meal_array[2],
            title: meal_array[3],
            id: meal_array[0]
          )
          expect(found).to_not be_nil

          # Delete. At end, user should have 0 meals
          found.delete
        end
      end
      expect(user1.meals.count).to eq(0)

      # user 2 should still have 30 meals
      expect(user2.meals.count).to eq(user2_meals_count)
    end
  end
end
