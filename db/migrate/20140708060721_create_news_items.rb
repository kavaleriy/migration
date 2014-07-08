class CreateNewsItems < ActiveRecord::Migration
  def change
    create_table :news_items do |t|
      t.date :issued
      t.string :content
      t.string :url
      t.boolean :published

      t.timestamps
    end
  end
end
