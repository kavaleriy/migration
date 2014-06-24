class Housing < ActiveRecord::Base
  belongs_to :type

  default_scope -> { order('koatuu_code DESC') }
  validates :type_id, presence: true
end
