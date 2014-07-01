class Housing < ActiveRecord::Base
  belongs_to :house

  default_scope -> { order('koatuu_code, house_id') }

  validates :koatuu_code, presence: true
  validates :house_id, presence: true
  validates :qty_places, presence: true
  validates_numericality_of :qty_places

  def self.has_school?(val)
    val == 1
  end
  def self.has_kgarten?(val)
    val == 1
  end


  def self.grouped_area
    res = {}
    Koatuu.areas().each {|area|
      area = area.code.slice(0,2)
      res["#{area}"] = Housing.where("qty_places > 0 and koatuu_code like '#{area}%'").sum('qty_places')
    }
    res
  end

  def self.grouped_region area
    res = {}
    Koatuu.regions(area).each {|region|
      region = region.code.slice(0,5)
      res["#{region}"] = Housing.where("qty_places > 0 and koatuu_code like '#{area}%'").sum('qty_places')
    }
    res
  end

end
