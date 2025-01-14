'use client';

export default function TrendingTopic() {

  const mockup_topics = [
    { username: "Username777",
      title: "ขอรีวิวสาขาวิศวะคอมลาดกระบังหน่อยครับ",
      img: "",
      likes: 194,
      comments: 14
    },
    { username: "Username999",
      title: "มีใครได้สมัคร TCAS68 รอบ 1 : โครงการผลิตแพทย์เพื่อชาวชนบท ม.นราธิวาสราชนครินทร์ บ้างคับ",
      img: "http://i.ibb.co/ncrXc2V/1.png",
      likes: 80,
      comments: 6
    },
    { username: "Username888",
      title: "อยากทราบว่าเรียนนิเทศน์ม.กรุงนี่ยากมั้ยคับ แล้วเรียนอะไรบ้าง",
      img: "",
      likes: 357,
      comments: 50
    },
    { username: "Username666",
      title: "TCAS68 รอบ 1 : มหาวิทยาลัยสงขลานครินทร์ (รอบ 1/2) ต้องใช้อะไรบ้างคับ",
      img: "http://i.ibb.co/B3s7v4h/2.png",
      likes: 80,
      comments: 6
    },
    { username: "Username555",
      title: "อยากเรียนนิติ ต้องอ่านอะไรไปสอบบ้างคะ",
      img: "",
      likes: 357,
      comments: 50
    }
  ];

  return (
    <div className="h-[calc(100vh-5.25rem)] w-full bg-monochrome-50 sticky overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-monochrome-200 top-[5.25rem] flex flex-col items-center p-8 border-l border-monochrome-400">
      <p className="w-full text-headline-5 text-primary-600">Stayed on Trend Topics</p>
      <div className="w-fit h-fit flex flex-col divide-y divide-monochrome-200 pt-4">
        {mockup_topics.map((item, index) => (
          <div key={index} className="w-full h-fit flex items-center gap-4 py-4 first:pt-0 last:pb-0">
            <div className="w-full h-full flex flex-col gap-2">
              <div className="flex content-center items-center gap-2">
                <div className="size-10">
                  <img src='/images/profile.png' className="w-full h-full object-cover rounded-full"/>
                </div>
                <p className="text-body-large">
                  {item.username}
                </p>
              </div>

              <p className="text-body-large">
                {item.title}
              </p>

              <p className="text-body-small text-monochrome-500">
                {item.likes} likes • {item.comments} comments
              </p>
            </div>
            {item.img &&
            <div className="w-[6rem] h-[6rem] flex-shrink-0">
              <img src={item.img} alt="image" className="w-full h-full object-cover rounded-[0.5rem]" />
            </div>
            }
          </div>
        ))}
      </div>
    </div>
  )
}