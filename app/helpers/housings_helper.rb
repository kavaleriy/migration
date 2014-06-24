module HousingsHelper
  def koatuu_title(code)
    return if code.nil?

    k = Koatuu.get_by_code code
    return if k.nil?

    "#{k[:region]}, #{k[:area]}"
  end
end
