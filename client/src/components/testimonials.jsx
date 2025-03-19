import { Star } from 'lucide-react';

const testimonials = [
  {
    name: 'Alexander Jacob',
    image: 'https://randomuser.me/api/portraits/men/75.jpg',
    feedback: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard',
  },
  {
    name: 'Jenny Wilson',
    image: 'https://randomuser.me/api/portraits/women/65.jpg',
    feedback: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard',
  },
  {
    name: 'Cameron Williamson',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    feedback: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard',
  },
];

export default function Testimonials() {
  return (
    <div className="bg-blue-100 py-10">
      <h2 className="text-3xl font-bold text-center mb-6">Testimonials</h2>
      <div className="flex flex-wrap justify-center gap-6">
        {testimonials.map((testimonial, index) => (
          <div key={index} className="bg-white shadow-lg rounded-xl p-6 w-72 text-center">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              className="w-20 h-20 mx-auto rounded-full mb-4 object-cover"
            />
            <h3 className="text-lg font-bold">{testimonial.name}</h3>
            <p className="text-gray-600 text-sm mt-2">{testimonial.feedback}</p>
            <div className="flex justify-center mt-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} color="#fbbf24" fill="#fbbf24" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
