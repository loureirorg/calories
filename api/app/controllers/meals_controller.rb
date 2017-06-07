class MealsController < ApplicationController
  before_action :authenticate_user!
  before_action :set_meal, only: [:show, :update, :destroy]

  def index
    query = current_user.meals.includes(:user)

    # filter
    query = query.where('eat_date >= ?', params['date-from']) if params['date-from']
    query = query.where('eat_date <= ?', params['date-to']) if params['date-to']
    query = query.where('eat_time >= ?', params['time-from']) if params['time-from']
    query = query.where('eat_time <= ?', params['time-to']) if params['time-to']

    # sort
    query = query.order(eat_date: :desc, eat_time: :desc)

    ####################################################
    # structure: {
    #    'some-day': {
    #      meals: [
    #        ['id-item-1', 'time-item-1', 'calories-item-1', 'title-item-1'],
    #        ['id-item-2', 'time-item-2', 'calories-item-2', 'title-item-2'],
    #       ]
    #    }
    # }
    ####################################################
    res = {}
    query.each do |meal|
      res[meal.eat_date] ||= { meals: [] }
      res[meal.eat_date][:meals] << ["#{meal.id}", meal.eat_time, meal.calories, meal.title]
    end
    render json: res.to_json
  end

  def create
    @meal = Meal.new(meal_params.merge({user: current_user}))

    if @meal.save
      render json: @meal, status: :created
    else
      render json: { errors: @meal.errors.messages }, status: :unprocessable_entity
    end
  end

  def show
    render json: @meal
  end

  def update
    if @meal.update(meal_params)
      render json: @meal
    else
      render json: { errors: @meal.errors.messages }, status: :unprocessable_entity
    end
  end

  def destroy
    @meal.delete
    render json: true.to_json
  end

  private

  def meal_params
    params.require(:meal).permit(:title, :calories, :eat_date, :eat_time)
  end

  def set_meal
    @meal = Meal.find_by(id: params[:id])

    # only current_user or ADMIN can CRUD it
    return if (@meal.user == current_user) || (current_user.role == 'ADMIN')
    render json: { error: 'Meal not found' }, status: :not_found
  end

end
