Rails.application.routes.draw do
  resources :cases

  get 'welcomepages/assign_case'
  get 'welcomepages/ipo'
  get 'welcomepages/check_document'
  get 'welcomepages/contact'
  post 'welcomepages/send_message'
  post 'welcomepages/check_qualification'
  post 'welcomepages/check_contact_qualification'
  post 'welcomepages/check_document_qualification'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  root to: 'welcomepages#legaloffice'
end
