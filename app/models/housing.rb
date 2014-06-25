class Housing < ActiveRecord::Base
  belongs_to :type

  default_scope -> { order('koatuu_code DESC') }

  validates :koatuu_code, presence: true
  validates :type_id, presence: true


  def self.typename(type)
    type.name if type
  end
  def self.has_school?(val)
    val == 1
  end
  def self.has_kgarten?(val)
    val == 1
  end
end
