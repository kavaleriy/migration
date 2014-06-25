class KoatuuUpdateFields < ActiveRecord::Migration
  def change
    remove_column :koatuus, :b3
    remove_column :koatuus, :b6

    add_column :koatuus, :level, :integer
  end
end
