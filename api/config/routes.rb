Rails.application.routes.draw do
  resources :meals

  devise_scope :user do
    get 'change-password',
        to: 'devise/passwords#edit',
        as: :edit_user_password
  end

  devise_for :users, controllers: {
    registrations: 'registrations',
    sessions: 'sessions',
    passwords: 'passwords'
  }

  scope :admin do
    get 'users', to: 'admins#user_index'
    get 'users/:id', to: 'admins#user_show'
    put 'users/:id', to: 'admins#user_update'
    delete 'users/:id', to: 'admins#user_destroy'
    post 'users', to: 'admins#user_create'
  end
end
