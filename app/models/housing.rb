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

  def self.group_qtt code
    Housing.where("koatuu_code like ?", "#{code}%").sum('qty_places')
  end

end
