class AdvertWorkAddProfessionId < ActiveRecord::Migration
  def change
    remove_column :advert_works, :rubric
    add_column :advert_works, :profession_id, :integer
  end
end
