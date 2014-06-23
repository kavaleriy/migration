json.array!(@regions) do |region|
  json.extract! region, :id, :name, :geo, :area_id
  json.url region_url(region, format: :json)
end
