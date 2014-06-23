class CreateKoatuus < ActiveRecord::Migration
  def change
    create_table :koatuus do |t|
      t.string :code
      t.string :name

      t.timestamps
    end
  end
end
