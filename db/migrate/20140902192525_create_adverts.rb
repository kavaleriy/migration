class CreateAdverts < ActiveRecord::Migration
  def change
    create_table :adverts do |t|
      t.string   :koatuu_code
      t.integer  :house_id
      t.string   :address
      t.integer  :cost

      t.integer  :qty_places
      t.integer  :has_school
      t.integer  :has_kgarden

      t.string   :email
      t.string   :fio
      t.string   :phone

      t.text     :note

      t.timestamps
    end
  end
end
