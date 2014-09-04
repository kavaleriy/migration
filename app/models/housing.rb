class Housing < ActiveRecord::Base
  belongs_to :house
  has_many :adverts

  after_save :log_housing

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

  def self.group_by_house area_code, house_id
    Housing.where(:house_id => house_id).where("koatuu_code like ?", "#{area_code}%").sum('qty_places')
  end

  private
  def log_housing
    ondate = Date.current
    log = HousingLog.where(koatuu_code: koatuu_code, house_name: house.name, ondate: ondate).first
    if log
      log.update( {qtt: qty_places } )
    else
      log = HousingLog.create( {koatuu_code: koatuu_code, house_name: house.name, qtt: qty_places, ondate: Date.current} )
    end

    log.save
  end

end
