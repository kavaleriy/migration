class Profession < ActiveRecord::Base
  has_many :advert_work

  def self.to_json(filter = '')
    filter = filter.mb_chars
    arr = []

    where("name like ?", "%#{filter}%").each { |area|
      arr << { name: area.name, id: area.id }
    }
    arr
  end


end
