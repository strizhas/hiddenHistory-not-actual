class CreateComments < ActiveRecord::Migration
  def change
    create_table :comments do |t|
      t.string  :commenter
      t.text    :body, null: false 
      t.integer :user_id   
      t.integer :commentable_id, null: false
      t.string  :commentable_type, null: false
      t.integer :category_id
      t.integer :likes, null: false , default: 0
      t.boolean :published, default: false

      t.timestamps null: false
    end
  end
end
