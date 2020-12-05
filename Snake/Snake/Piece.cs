using System.Drawing;
using System.IO;
using System.Windows.Forms;

namespace Snake
{
    class Piece : Label
    {
        public Piece(int x, int y)
        {
            Location = new Point(x, y);
            Size = new Size(20, 20);
            Size = new Size(20, 20);
            BackColor = Color.BlueViolet;
            StreamReader sr = new StreamReader("Theme.WRProp");
            var checkTheme = sr.ReadToEnd();
            string s1 = "light";
            bool b = checkTheme.Contains(s1);
            sr.Close();
            if (b == true)
            {
                BackColor = Color.Gold;
            }
            //Image = Image.FromFile("C:/Users/hypen/source/repos/Snake/Snake/Resources/writenotebg.png");
            Enabled = false;
        }
    }
}