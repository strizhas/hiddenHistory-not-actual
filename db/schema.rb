# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170316042616) do

  create_table "articles", force: :cascade do |t|
    t.string   "title",                       null: false
    t.text     "text",                        null: false
    t.string   "image"
    t.string   "intro",                       null: false
    t.integer  "user_id",     default: 1,     null: false
    t.integer  "era"
    t.integer  "category_id"
    t.boolean  "published",   default: false, null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "buildings", force: :cascade do |t|
    t.string   "title",                       null: false
    t.text     "intro",                       null: false
    t.text     "text",                        null: false
    t.string   "image"
    t.integer  "era"
    t.integer  "category_id"
    t.integer  "building_id"
    t.integer  "user_id",     default: 1,     null: false
    t.decimal  "latitude"
    t.decimal  "longitude"
    t.integer  "status",                      null: false
    t.boolean  "model3d",     default: false, null: false
    t.boolean  "published",   default: false, null: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
  end

  create_table "categories", force: :cascade do |t|
    t.string   "title",                null: false
    t.text     "description"
    t.integer  "parent_category_id"
    t.string   "parent_category_type"
    t.string   "image"
    t.datetime "created_at",           null: false
    t.datetime "updated_at",           null: false
  end

  create_table "comments", force: :cascade do |t|
    t.string   "commenter"
    t.text     "body",                             null: false
    t.integer  "user_id"
    t.integer  "commentable_id",                   null: false
    t.string   "commentable_type",                 null: false
    t.integer  "category_id"
    t.integer  "likes",            default: 0,     null: false
    t.boolean  "published",        default: false
    t.boolean  "read",             default: false
    t.datetime "created_at",                       null: false
    t.datetime "updated_at",                       null: false
  end

  create_table "guides", force: :cascade do |t|
    t.string   "title"
    t.text     "text"
    t.string   "image"
    t.integer  "schema_id"
    t.integer  "user_id"
    t.string   "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "likes", force: :cascade do |t|
    t.integer  "likeable_id"
    t.string   "likeable_type"
    t.integer  "user_id",       default: 1, null: false
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "markers", force: :cascade do |t|
    t.integer  "markerable_id"
    t.string   "markerable_type"
    t.integer  "coord_x"
    t.integer  "coord_y"
    t.integer  "angle"
    t.integer  "year"
    t.boolean  "published"
    t.integer  "schema_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "news", force: :cascade do |t|
    t.string   "title",                      null: false
    t.text     "intro",                      null: false
    t.text     "text",                       null: false
    t.integer  "user_id",    default: 1,     null: false
    t.string   "image"
    t.integer  "era"
    t.string   "parent"
    t.boolean  "published",  default: false, null: false
    t.datetime "created_at",                 null: false
    t.datetime "updated_at",                 null: false
  end

  create_table "photos", force: :cascade do |t|
    t.string   "image",                   null: false
    t.text     "text"
    t.text     "alt"
    t.integer  "user_id",     default: 1, null: false
    t.string   "author"
    t.integer  "building_id"
    t.integer  "schema_id"
    t.boolean  "published"
    t.integer  "year"
    t.integer  "likes",       default: 0, null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
  end

  create_table "schemas", force: :cascade do |t|
    t.string   "title",                                  null: false
    t.string   "schema",                                 null: false
    t.string   "image"
    t.string   "text"
    t.integer  "building_id"
    t.integer  "user_id"
    t.integer  "angle"
    t.decimal  "bounce_up_ltd", precision: 10, scale: 6
    t.decimal  "bounce_up_lng", precision: 10, scale: 6
    t.decimal  "bounce_dn_ltd", precision: 10, scale: 6
    t.decimal  "bounce_dn_lng", precision: 10, scale: 6
    t.datetime "created_at",                             null: false
    t.datetime "updated_at",                             null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "username",                             null: false
    t.string   "email",                                null: false
    t.string   "image"
    t.string   "encrypted_password",                   null: false
    t.string   "salt"
    t.string   "role",               default: "guest", null: false
    t.date     "birthdate"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
