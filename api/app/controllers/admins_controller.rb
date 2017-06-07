# Admin / Manager actions
class AdminsController < ApplicationController
  before_action :authenticate_user!
  before_action :authenticate_role!, except: [:meal_index]
  before_action :set_user, only: [:user_show, :user_update, :user_destroy]

  def meal_index
    @meals = Meal.joins(:user).includes(:user)

    # filter
    @meals = @meals.search_for(params[:keyword]) if params[:keyword]

    # sort by: using pg_search, 'users' become 'users_meals'
    if params[:keyword] && params['order-by'] && params['order-by'].starts_with?('users.')
      params['order-by'] = 'users_meals.' + params['order-by'][6..-1]
    end

    # sort by
    order_args = []
    if params['order-by']
      params['order-dir'] ||= 1
      order_dir = params['order-dir'] == '1' ? 'asc' : 'desc'
      order_args << "#{params['order-by']} #{order_dir}"
    end

    # default sorting
    order_args << 'eat_date desc' if params['order-by'] != 'eat_date'
    order_args << 'eat_time desc' if params['order-by'] != 'eat_time'

    @meals = @meals.reorder(order_args)

    # limit
    @meals = @meals.limit(100)

    render json: @meals
  end

  def user_index
    @users = User.all

    # managers can only see regular users
    @users = @users.where(role: 'USER') if current_user.role == 'MANAGER'

    # filter
    @users = @users.search_for(params[:keyword]) if params[:keyword]
    @users = @users.where(role: params[:role]) if params[:role]

    # sort by
    params['order-dir'] ||= 1
    order_dir = params['order-dir'] == '1' ? :asc : :desc
    @users = @users.order(params['order-by'] => order_dir) if params['order-by']

    # limit
    @users = @users.limit(100)

    render json: @users
  end

  def user_show
    render json: @user
  end

  def user_create
    # only admins can create non-regular users
    params[:user][:role] ||= 'USER'
    if (params[:user][:role] != 'USER') && (current_user.role != 'ADMIN')
      render json: { error: 'Not allowed' }, status: :unauthorized
      return
    end

    @user = User.new(user_params)

    # new password
    @user.password = params[:user][:password]

    if @user.save
      render json: @user, status: :created
    else
      render json: { errors: @user.errors.messages }, status: :unprocessable_entity
    end
  end

  def user_update
    # only admins can change roles
    if (params[:user][:role]) && (@user.role != params[:user][:role]) && (current_user.role != 'ADMIN')
      render json: { error: 'Not allowed' }, status: :unauthorized
      return
    end

    @user.name = params[:user][:name]
    @user.email = params[:user][:email]
    @user.daily_calories_max = params[:user][:daily_calories_max]
    @user.role = params[:user][:role] if (current_user.role == 'ADMIN') && params[:user][:role]
    @user.password = params[:user][:password] if params[:user][:password]
    @user.save

    if @user.save
      render json: @user
    else
      render json: { errors: @user.errors.messages }, status: :unprocessable_entity
    end
  end

  def user_destroy
    @user.destroy
    render json: true.to_json
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user
    @user = User.find(params[:id])

    # only admins can CRUD non-regular users
    return if (@user.role == 'USER') || (current_user.role == 'ADMIN')
    render json: { error: 'Not allowed' }, status: :unauthorized
  end

  # Only allow a trusted parameter "white list" through.
  def user_params
    params.require(:user).permit(:name, :email, :role, :daily_calories_max)
  end

  def authenticate_role!
    return if user_signed_in? && current_user.role.in?(%w[ADMIN MANAGER])
    render json: { error: 'Not allowed' }, status: :unauthorized
  end
end
