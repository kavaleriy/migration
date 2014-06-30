class AddIndexToKoatuu < ActiveRecord::Migration
  def change
    add_index :koatuus, [:name], name: "index_koatuu_on_code"
  end
end
