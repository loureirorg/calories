class RegistrationsController < Devise::RegistrationsController

  # PUT /resource
  # We need to use a copy of the resource because we don't want to change
  # the current user in place.
  def update
    self.resource = resource_class.to_adapter.get!(send(:"current_#{resource_name}").to_key)
    prev_unconfirmed_email = resource.unconfirmed_email if resource.respond_to?(:unconfirmed_email)

    if account_update_params[:password].present?
      resource.password = account_update_params[:password]
      resource.save!
    end

    resource_updated = update_resource(resource, account_update_params)
    yield resource if block_given?
    if resource_updated
      if is_flashing_format?
        flash_key = update_needs_confirmation?(resource, prev_unconfirmed_email) ?
          :update_needs_confirmation : :updated
        set_flash_message :notice, flash_key
      end
      bypass_sign_in resource, scope: resource_name
      # respond_with resource, location: after_update_path_for(resource)
      render json: resource.to_json
    else
      clean_up_passwords resource
      set_minimum_password_length
      respond_with resource
    end

  end

  protected

  def sign_up_params
    params.require(:user).permit(:name, :daily_calories_max, :email, :password, :password_confirmation)
  end

  def account_update_params
    params.require(:user).permit(:name, :daily_calories_max, :email, :password, :password_confirmation, :current_password)
  end

  def update_resource(resource, params)
    resource.update_without_password(params)
  end

end
