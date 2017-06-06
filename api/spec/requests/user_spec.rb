RSpec.describe 'User API', :type => :request do
  include UserHelpers

  describe 'sign out' do
    it 'should return false if not signed in' do
      successful_sign_out
      expect(json).to be false
    end

    it 'should return true if signed in' do
      successful_sign_up && successful_sign_out
      expect(json).to be true
    end
  end

  describe 'sign in' do
    it 'should return unauthorized if user does not exist' do
      user = FactoryGirl.build(:user)
      params = {user: {email: user.email, password: user.password}}
      post '/users/sign_in', params: params, as: :json
      assert_response :unauthorized
    end

    it 'should return unauthorized if the password is wrong' do
      # create unauthenticated user
      user = successful_sign_up
      successful_sign_out

      # tries to sign in with wrong password
      params = {user: {email: user.email, password: 'wrong-password'}}
      post '/users/sign_in', params: params, as: :json
      assert_response :unauthorized
    end

    it 'should return success if user exists' do
      # create unauthenticated user
      user = successful_sign_up
      successful_sign_out

      # sign in with right credentials
      successful_sign_in(user)
    end

    it 'should return wrong user if it is already signed in' do
      # create unauthenticated "user 1"
      user_1 = successful_sign_up
      successful_sign_out

      # create authenticated "user 2"
      user_2 = successful_sign_up

      # tries to authenticate "user 1" on "user 2" session
      successful_sign_in(user_1)

      # returns success, but with "user 2" credentials
      expect(json['email']).to_not be(user_1.email)
      expect(json['email']).to eq(user_2.email)
      assert_response :success
    end
  end

  describe 'sign up' do
    it 'should return an error if there is no correct email' do
      params = {user: {name: 'John Doe', email: 'a.com', password: 'password'}}
      post '/users', params: params, as: :json
      expect(json['errors'].length).to eq(1) # 1 and only 1 error
      expect(json['errors']['email']).to eq(['is invalid'])
      assert_response :unprocessable_entity
    end

    it 'should return success on correct name/email/password' do
      successful_sign_up
    end

    it 'should return error if email is duplicated' do
      # create unauthenticated user
      user = successful_sign_up
      successful_sign_out

      # try to create the same user again
      params = {user: {email: user.email, password: user.password}}
      post '/users', params: params, as: :json
      expect(json['errors']['email']).to eq(['has already been taken'])
      assert_response :unprocessable_entity
    end
  end
end
