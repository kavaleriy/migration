json.array!(@housings) do |housing|
  json.extract! housing, :id, :area_id, :type_id, :qty_places, :qty_work, :has_school, :has_kgarden
  json.url housing_url(housing, format: :json)
end
