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

ActiveRecord::Schema.define(version: 20140623093747) do

  create_table "areas", force: true do |t|
    t.string   "name"
    t.string   "geo"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "cities", force: true do |t|
    t.string   "name"
    t.string   "geo"
    t.integer  "region_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "housings", force: true do |t|
    t.integer  "area_id"
    t.integer  "type_id"
    t.integer  "qty_places"
    t.integer  "qty_work"
    t.integer  "has_school"
    t.integer  "has_kgarden"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "koatuus", force: true do |t|
    t.string   "code"
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "regions", force: true do |t|
    t.string   "name"
    t.string   "geo"
    t.integer  "area_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "types", force: true do |t|
    t.string   "name"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
