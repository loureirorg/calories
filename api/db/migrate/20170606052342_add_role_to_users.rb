# Adds a "role" field to users.
# This field can be set to 'USER', 'MANAGER', 'ADMIN'
class AddRoleToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :role, :string, default: 'USER'
    add_index :users, :role
  end
end
