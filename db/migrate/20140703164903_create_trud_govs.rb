class CreateTrudGovs < ActiveRecord::Migration
  def change
    create_table :trud_govs do |t|
      t.string :trud_code
      t.string :koatuu_code

      t.timestamps
    end
  end
end
