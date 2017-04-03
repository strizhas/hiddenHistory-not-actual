class CreateLikes < ActiveRecord::Migration
  def change
    create_table :likes do |t|
      t.integer  :likeable_id
      t.string 	 :likeable_type
      t.integer  :user_id, null: false, default: 1

      t.timestamps null: false
    end
  end
end
