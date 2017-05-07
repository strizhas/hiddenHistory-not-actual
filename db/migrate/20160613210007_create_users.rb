class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|

      t.string :username, null: false 
      t.string :email, null: false
      t.string :image
      t.string :encrypted_password, null: false 
      t.string :salt
      t.string :role, null: false, default: 'member'
	    t.date	 :birthdate
      t.timestamps
	  
    end
  end
end
