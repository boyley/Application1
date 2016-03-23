import org.junit.Test;

import java.math.BigDecimal;

/**
 * Created by Bogle on 2016/3/23.
 */
public class TestAccount {

    @Test
    public void accounts() {

        BigDecimal lv = new BigDecimal(0.08);   //利息

        BigDecimal f07 = new BigDecimal(100000);
        int f09 = 6;
        BigDecimal monthRate = lv.setScale(9,
                BigDecimal.ROUND_HALF_UP).divide(new BigDecimal(12),
                9, BigDecimal.ROUND_HALF_UP);

        BigDecimal monthPayTotal = debx(f07, monthRate, f09);

        //利息
        BigDecimal interest = f07.multiply(monthRate).setScale(2,
                BigDecimal.ROUND_HALF_UP);


        System.out.println("monthRate:" + monthRate);
        System.out.println("MyTest.main:" + monthPayTotal);


    }

    private static BigDecimal debx(BigDecimal total, BigDecimal monthRate, int terms) {
        BigDecimal tmp = monthRate.add(new BigDecimal(1)).pow(terms);
        return total
                .multiply(monthRate)
                .multiply(tmp)
                .divide(tmp.subtract(new BigDecimal(1)), 2,
                        BigDecimal.ROUND_HALF_UP);
    }

}
