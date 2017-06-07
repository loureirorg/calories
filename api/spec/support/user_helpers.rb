module UserHelpers
  def successful_sign_up
    user = FactoryGirl.build(:user)
    params = { user: { email: user.email, name: user.name, password: user.password } }.as_json
    post '/users', params: params, as: :json
    expect(response).to be_success

    user
  end

  def successful_sign_in(user)
    params = { user: { email: user.email, password: user.password } }
    post '/users/sign_in', params: params, as: :json
    expect(response).to be_success
  end

  def successful_sign_out
    delete '/users/sign_out', as: :json
    expect(response).to be_success
  end
end
