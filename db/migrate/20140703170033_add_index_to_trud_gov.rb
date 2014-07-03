class AddIndexToTrudGov < ActiveRecord::Migration
  def change
    add_index :trud_govs, [:koatuu_code], name: "index_trud_gov_on_koatuu_code", unique: true
  end
end
