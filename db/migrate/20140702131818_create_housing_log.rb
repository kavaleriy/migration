class CreateHousingLog < ActiveRecord::Migration
  def change
    create_table :housing_logs do |t|
      t.string :koatuu_code
      t.string :house_name
      t.integer :qtt
      t.date :ondate
    end
  end
end
