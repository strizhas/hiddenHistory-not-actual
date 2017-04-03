class CreateSchemas < ActiveRecord::Migration
  def change
    create_table :schemas do |t|
      t.string  :title,  null: false
      t.string  :schema, null: false
      t.string  :image
      t.string  :text
      t.integer :building_id
      t.integer :user_id
      t.integer :angle
      t.decimal :bounce_up_ltd, :precision=>10, :scale=>6
      t.decimal :bounce_up_lng, :precision=>10, :scale=>6
      t.decimal :bounce_dn_ltd, :precision=>10, :scale=>6
      t.decimal :bounce_dn_lng, :precision=>10, :scale=>6

      t.timestamps null: false
    end
  end
end
