import DonateForm from './DonateForm'

export const metadata = { title: 'Donate' }

export default function DonatePage() {
  return (
    <div className="wrap">
      <h1>Give to Kifalah</h1>
      <p>Choose where your gift goes. You will receive a receipt with a reference number.</p>
      <DonateForm />
    </div>
  )
}
