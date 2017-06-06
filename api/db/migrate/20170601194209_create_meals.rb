class CreateMeals < ActiveRecord::Migration[5.1]
  def change
    create_table :meals do |t|
      t.integer :user_id, null: false
      t.string :title, null: false
      t.integer :calories, null: false
      t.date :eat_date, null: false
      t.string :eat_time, null: false

      t.timestamps
    end
    add_index :meals, :user_id
    add_index :meals, :eat_date
    add_index :meals, :eat_time
  end
end
