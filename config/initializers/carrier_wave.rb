require 'carrierwave/orm/activerecord'

CarrierWave.configure do |config|

	config.storage		= :aws
	config.aws_bucket	= "hiddenhistory-photo"
	config.aws_acl 		=  :public_read

	config.aws_credentials = {
		:access_key_id		=> 'hidden',
		:secret_access_key  => 'hidden',
		:region				=> 'eu-central-1'
	}

	 config.aws_attributes = {
	 	:cache_control => 'max-age=315576000',
	 	:expires => 1.year.from_now.httpdate
	 }

end
