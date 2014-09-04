json.array!(@adverts) do |advert|
  json.extract! advert, :id, :housing_id, :email, :fio, :phone
  json.url advert_url(advert, format: :json)
end
