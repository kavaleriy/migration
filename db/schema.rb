# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20150318094257) do

  create_table "advert_works", force: true do |t|
    t.integer  "advert_id"
    t.integer  "places"
    t.integer  "salary"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "profession_id"
  end

  create_table "adverts", force: true do |t|
    t.string   "koatuu_code"
    t.integer  "house_id"
    t.string   "address"
    t.integer  "cost"
    t.integer  "qty_places"
    t.integer  "has_school"
    t.integer  "has_kgarden"
    t.string   "email"
    t.string   "fio"
    t.string   "phone"
    t.text     "note"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "geos", force: true do |t|
    t.string  "koatuu_code"
    t.decimal "lon",         precision: 15, scale: 10
    t.decimal "lat",         precision: 15, scale: 10
    t.integer "zoom"
  end

  create_table "houses", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "housing_logs", force: true do |t|
    t.string  "koatuu_code"
    t.string  "house_name"
    t.integer "qtt"
    t.date    "ondate"
  end

  create_table "housings", force: true do |t|
    t.string   "koatuu_code"
    t.integer  "house_id"
    t.integer  "qty_places"
    t.integer  "has_school"
    t.integer  "has_kgarden"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "housings", ["koatuu_code", "house_id"], name: "index_housings_on_koatuu_code_and_house_id", unique: true

  create_table "koatuus", force: true do |t|
    t.string   "code"
    t.string   "name"
    t.string   "note"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "level"
  end

  add_index "koatuus", ["name"], name: "index_koatuu_on_code"

  create_table "news_items", force: true do |t|
    t.date     "issued"
    t.string   "content"
    t.string   "url"
    t.boolean  "published"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "boost"
    t.string   "page"
  end

  create_table "newspapers", force: true do |t|
    t.text     "embed"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "professions", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "trud_govs", force: true do |t|
    t.string   "trud_code"
    t.string   "koatuu_code"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "trud_govs", ["koatuu_code"], name: "index_trud_gov_on_koatuu_code", unique: true

  create_table "users", force: true do |t|
    t.string   "email",                  default: "", null: false
    t.string   "encrypted_password",     default: "", null: false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          default: 0,  null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "area"
    t.integer  "roles_mask"
  end

  add_index "users", ["email"], name: "index_users_on_email", unique: true
  add_index "users", ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true

  create_table "workplaces", force: true do |t|
    t.string   "koatuu_code"
    t.string   "rubric"
    t.integer  "places"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "workplaces", ["koatuu_code", "rubric"], name: "index_workplaces_on_koatuu_code_and_rubric", unique: true

end
