class CreateKoatuus < ActiveRecord::Migration
  def change
    create_table :koatuus do |t|
      t.string :code
      t.string :name
      t.string :note
      t.string :b3
      t.string :b6

      t.timestamps
    end
  end
end
