class SessionsController < Devise::SessionsController

  def destroy
    if ! user_signed_in?
      render json: false.to_json, status: :ok
      return
    end

    signed_out = (Devise.sign_out_all_scopes ? sign_out : sign_out(resource_name))
    set_flash_message! :notice, :signed_out if signed_out
    yield if block_given?
    # respond_to_on_destroy
    render json: true.to_json, status: :ok
  end

  def respond_to_on_destroy
    render json: false.to_json, status: :ok
  end

end
