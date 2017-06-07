module MealsHelpers
  def successful_meal_create
    meal = FactoryGirl.build(:meal)
    post '/meals', params: { meal: meal }, as: :json
    expect(response).to be_success
    json
  end
end
