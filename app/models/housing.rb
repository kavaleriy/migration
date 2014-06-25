class Housing < ActiveRecord::Base
  belongs_to :house

  default_scope -> { order('updated_at DESC') }

  validates :koatuu_code, presence: true
  validates :house_id, presence: true
  validates :qty_places, presence: true


  def self.has_school?(val)
    val == 1
  end
  def self.has_kgarten?(val)
    val == 1
  end
end
